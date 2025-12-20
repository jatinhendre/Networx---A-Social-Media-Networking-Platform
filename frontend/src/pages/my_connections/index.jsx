import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { 
  getMyConnections, 
  getConnectionRequests,
  acceptConnectionRequest 
} from "@/config/redux/action/AuthAction";
import PostsFeed from "./PostsFeed";
import styles from "./style.module.css"
function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("connections");
  const [processingRequest, setProcessingRequest] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get token from multiple sources
  useEffect(() => {
    let foundToken = authState.user?.token || 
                     authState.token || 
                     localStorage.getItem('userToken') || 
                     sessionStorage.getItem('userToken');
    
    if (foundToken) {
      setToken(foundToken);
    }
  }, [authState.user, authState.token]);

  // Fetch connection data when token is available
  useEffect(() => {
    if (token) {
      dispatch(getConnectionRequests({ token }));
      dispatch(getMyConnections({ token }));
    }
  }, [token, dispatch]);

  // Determine which user is the "other" person in a connection
  const getOtherUser = (conn) => {
    if (conn.userId?._id === authState.user?._id) {
      return conn.connectionId;
    }
    return conn.userId;
  };

  // Filter only accepted connections
  const acceptedConnections = (authState.connections || []).filter(
    (conn) => conn.status_accepted === true
  );

  // Search filter function
  const filterBySearch = (items, searchTerm) => {
    if (!searchTerm.trim()) return items;
    
    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(item => {
      const user = item.userId || getOtherUser(item);
      
      return (
        user?.name?.toLowerCase().includes(lowerSearch) ||
        user?.username?.toLowerCase().includes(lowerSearch) ||
        user?.email?.toLowerCase().includes(lowerSearch)
      );
    });
  };

  // Apply search filter
  const filteredRequests = filterBySearch(
    authState.connectionRequests || [], 
    searchQuery
  );
  
  const filteredConnections = filterBySearch(
    acceptedConnections, 
    searchQuery
  );

  // Handle accept/reject connection request
  const handleConnectionAction = async (requestId, actionType) => {
    if (!token) return;
    
    setProcessingRequest(requestId);
    
    try {
      await dispatch(
        acceptConnectionRequest({
          token: token,
          requestId: requestId,
          action_type: actionType,
        })
      ).unwrap();

      // Refresh both lists after successful action
      dispatch(getConnectionRequests({ token }));
      dispatch(getMyConnections({ token }));
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Clear search when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  if (!token) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.container}>
            <h2 className={styles.pageTitle}>My Connections</h2>
            <div className={styles.authRequired}>
              <h3>Authentication Required</h3>
              <p>Please log in to view your connections.</p>
              <button
                onClick={() => {
                  const localToken = localStorage.getItem('userToken');
                  if (localToken) {
                    setToken(localToken);
                  } else {
                    window.location.href = '/login';
                  }
                }}
                className={styles.retryButton}
              >
                Retry / Go to Login
              </button>
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h2 className={styles.pageTitle}>My Connections</h2>

          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            <button
              onClick={() => handleTabChange("connections")}
              className={`${styles.tab} ${activeTab === "connections" ? styles.activeTab : ""}`}
            >
              Connected ({acceptedConnections.length})
            </button>
            <button
              onClick={() => handleTabChange("requests")}
              className={`${styles.tab} ${activeTab === "requests" ? styles.activeTab : ""}`}
            >
              Requests ({authState.connectionRequests?.length || 0})
            </button>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <svg 
                className={styles.searchIcon} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={`Search ${activeTab === "requests" ? "requests" : "connections"} by name, username, or email...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={styles.clearButton}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {searchQuery && (
              <div className={styles.searchResults}>
                Showing {activeTab === "requests" ? filteredRequests.length : filteredConnections.length} of{" "}
                {activeTab === "requests" ? (authState.connectionRequests?.length || 0) : acceptedConnections.length} results
              </div>
            )}
          </div>

          {/* Connection Requests Tab */}
          {activeTab === "requests" && (
            <div className={styles.tabContent}>
              <h3 className={styles.sectionTitle}>Connection Requests</h3>
              
              {authState.isLoading ? (
                <p className={styles.loadingText}>Loading requests...</p>
              ) : filteredRequests.length === 0 ? (
                <div>
                  <p className={styles.emptyState}>
                    {searchQuery 
                      ? `No requests found matching "${searchQuery}"`
                      : "No pending connection requests"}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={() => dispatch(getConnectionRequests({ token }))}
                      className={styles.refreshButton}
                    >
                      Refresh Requests
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.requestsList}>
                  {filteredRequests.map((request) => {
                    const requester = request.userId;
                    return (
                      <div key={request._id} className={styles.requestCard}>
                        <div className={styles.userInfo}>
                          <img
                            src={requester?.profilePicture || "/default-avatar.png"}
                            alt={requester?.name}
                            className={styles.avatar}
                          />
                          <div>
                            <div className={styles.userName}>{requester?.name}</div>
                            <div className={styles.userUsername}>@{requester?.username}</div>
                            <div className={styles.userEmail}>{requester?.email}</div>
                          </div>
                        </div>

                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleConnectionAction(request._id, "accept")}
                            disabled={processingRequest === request._id}
                            className={styles.acceptButton}
                          >
                            {processingRequest === request._id ? "Processing..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleConnectionAction(request._id, "reject")}
                            disabled={processingRequest === request._id}
                            className={styles.rejectButton}
                          >
                            {processingRequest === request._id ? "Processing..." : "Reject"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Accepted Connections Tab */}
          {activeTab === "connections" && (
            <div className={styles.tabContent}>
              <h3 className={styles.sectionTitle}>My Connections</h3>
              {filteredConnections.length === 0 ? (
                <p className={styles.emptyStpostate}>
                  {searchQuery 
                    ? `No connections found matching "${searchQuery}"`
                    : "No connections yet. Start connecting with people!"}
                </p>
              ) : (
                <>
                  <div className={styles.connectionsGrid}>
                    {filteredConnections.map((conn) => {
                      const otherUser = getOtherUser(conn);
                      return (
                        <div key={conn._id} className={styles.connectionCard}>
                          <img
                            src={otherUser?.profilePicture || "/default.jpg"}
                            alt={otherUser?.name}
                            className={styles.avatar}
                          />
                          <div>
                            <div className={styles.userName}>{otherUser?.name}</div>
                            <div className={styles.userUsername}>@{otherUser?.username}</div>
                            <div className={styles.userEmail}>{otherUser?.email}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <PostsFeed connections={acceptedConnections} />
                </>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnections;