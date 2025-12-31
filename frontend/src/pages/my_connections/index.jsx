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
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import Image from "next/image";
import { useRouter } from "next/router";

function MyConnections() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("connections");
  const [processingRequest, setProcessingRequest] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const foundToken = localStorage.getItem('token') || 
                       localStorage.getItem('userToken') || 
                       authState.user?.token;
    
    if (foundToken) {
      setToken(foundToken);
    }
  }, [authState.user]);

  // Fetch connection data when token is available
  useEffect(() => {
    if (token) {
      dispatch(getConnectionRequests({ token }));
      dispatch(getMyConnections({ token }));
    }
  }, [token, dispatch]);

  
  const getOtherUser = (conn) => {
    if (!conn || !authState.user) return null;
    const currentUserId = String(authState.user._id);
    
   
    const senderId = String(conn.userId?._id || conn.userId);
    
   
    return senderId === currentUserId ? conn.connectionId : conn.userId;
  };

 const getAvatarUrl = (user) => {
  return user?.profilePicture && user.profilePicture !== ""
    ? user.profilePicture
    : "/default.jpg";
};

  const acceptedConnections = (authState.connections || []).filter(
    (conn) => conn.status_accepted === true
  );

 
  const filterBySearch = (items, searchTerm, isRequestsTab) => {
    if (!searchTerm.trim()) return items;
    
    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(item => {
      
      const targetUser = isRequestsTab ? item.userId : getOtherUser(item);
      
      return (
        targetUser?.name?.toLowerCase().includes(lowerSearch) ||
        targetUser?.username?.toLowerCase().includes(lowerSearch) ||
        targetUser?.email?.toLowerCase().includes(lowerSearch)
      );
    });
  };

  
  const filteredRequests = filterBySearch(
    authState.connectionRequests || [], 
    searchQuery,
    true
  );
  
  const filteredConnections = filterBySearch(
    acceptedConnections, 
    searchQuery,
    false
  );

  
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

     
      dispatch(getConnectionRequests({ token }));
      dispatch(getMyConnections({ token }));
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setProcessingRequest(null);
    }
  };

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
                onClick={() => window.location.href = '/login'}
                className={styles.retryButton}
              >
                Go to Login
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

          
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={`Search ${activeTab === "requests" ? "requests" : "connections"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={styles.clearButton}>×</button>
              )}
            </div>
          </div>

          
          {activeTab === "requests" && (
            <div className={styles.tabContent}>
              <h3 className={styles.sectionTitle}>Pending Requests</h3>
              {authState.isLoading ? (
                <p className={styles.loadingText}>Loading...</p>
              ) : filteredRequests.length === 0 ? (
                <p className={styles.emptyState}>No requests found.</p>
              ) : (
                <div className={styles.requestsList}>
                  {filteredRequests.map((request) => {
                    const requester = request.userId;
                    return (
                      <div key={request._id} className={styles.requestCard}>
                        <div className={styles.userInfo}>
                          <Image
                            src={getAvatarUrl(requester)}
                            alt={requester?.name}
                            className={styles.avatar}
                            width={40}
                            height={40}
                          />
                          <div>
                            <div className={styles.userName}>{requester?.name}</div>
                            <div className={styles.userUsername}>@{requester?.username}</div>
                          </div>
                        </div>

                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleConnectionAction(request._id, "accept")}
                            disabled={processingRequest === request._id}
                            className={styles.acceptButton}
                          >
                            {processingRequest === request._id ? "..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleConnectionAction(request._id, "reject")}
                            disabled={processingRequest === request._id}
                            className={styles.rejectButton}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          
          {activeTab === "connections" && (
            <div className={styles.tabContent}>
              <h3 className={styles.sectionTitle}>Your Network</h3>
              {filteredConnections.length === 0 ? (
                <p className={styles.emptyState}>No connections found.</p>
              ) : (
                <>
                  <div className={styles.connectionsGrid}>
                    {filteredConnections.map((conn) => {
                      const otherUser = getOtherUser(conn);
                      return (
                        <div style={{cursor:'pointer'}} onClick={()=>{
                          router.push('/view_profile/' + otherUser?.username)
                        }} key={conn._id} className={styles.connectionCard}>
                          <Image
                            src={getAvatarUrl(otherUser)}
                            alt={otherUser?.name}
                            className={styles.avatar}
                            width={40}
                            height={40}
                          />
                          <div>
                            <div className={styles.userName}>{otherUser?.name}</div>
                            <div className={styles.userUsername}>@{otherUser?.username}</div>
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