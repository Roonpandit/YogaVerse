import React from "react";
import Groups from "./Groups";
import NavUser from "./Nav-User";
import "./MyGroupsPage.css"
function MyGroupsPage() {
  return (
    <>
      <NavUser />
      <main className="main">
        <h1 className="page-title">My Groups</h1>

        <h2 className="section-title">Your Active Groups</h2>
        <Groups type="active" />

        <h2 className="section-title">Your Past Groups</h2>
        <div className="groups-container">
          <div className="group-card">
            <div className="group-header">
              <div className="group-name">Evening Meditation</div>
              <div className="group-members">8 members</div>
            </div>
            <div className="group-activity">
              <div className="asana-item">
                <span className="asana-difficulty difficulty-1">1</span>
                <span className="asana-name">Lotus Pose</span>
                <span className="asana-user">by Alex S.</span>
              </div>
            </div>
            <div className="group-status">Inactive since April 2025</div>
            <a href="#" className="view-more">
              View History
            </a>
          </div>
        </div>

        <h2 className="section-title">Create a New Group</h2>
        <div className="create-group-container">
          <form className="create-group-form">
            <div className="form-group">
              <label htmlFor="group-name">Group Name</label>
              <input
                type="text"
                id="group-name"
                placeholder="Enter a name for your group"
              />
            </div>
            <div className="form-group">
              <label htmlFor="group-description">Description</label>
              <textarea
                id="group-description"
                placeholder="Describe your group's focus and goals"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="group-privacy">Privacy</label>
              <select id="group-privacy">
                <option value="public">Public - Anyone can join</option>
                <option value="private">Private - By invitation only</option>
              </select>
            </div>
            <button type="submit" className="create-button">
              Create Group
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default MyGroupsPage;
