// notificationUtils.js

// Function to show a notification
export function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `toast ${type}`; // Add classes for styling
    notification.innerHTML = message; // Use innerHTML to support HTML content

    // Style the toast
    Object.assign(notification.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: type === "error" ? "#f44336" : type === "info" ? "#2196F3" : "#4CAF50",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        zIndex: 1000,
        fontSize: "14px",
        fontWeight: "bold",
    });

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}