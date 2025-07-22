// User authentication state management
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Check user login status
export function checkAuthState() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}

// User logout
export async function logOut() {
  try {
    await signOut(auth);
    console.log("User logged out");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

// Update navigation bar user status display
export async function updateNavigation(user) {
  // Try ID selector first (most reliable)
  let userActions = document.getElementById('user-auth-area');
  
  if (!userActions) {
    // Try multiple class selectors to find the user actions area
    userActions = document.querySelector('header .container .flex.space-x-1.md\\:space-x-2.text-sm.md\\:text-lg.justify-end');
  }
  
  if (!userActions) {
    // Alternative selectors for different page structures
    userActions = document.querySelector('header .flex.space-x-1.md\\:space-x-2.text-sm.md\\:text-lg.justify-end');
  }
  
  if (!userActions) {
    userActions = document.querySelector('header .flex.justify-end');
  }
  
  if (!userActions) {
    userActions = document.querySelector('header div.flex.space-x-1');
  }
  
  if (!userActions) {
    console.log("Could not find user actions area, trying generic selector");
    // Find any div with class containing "space-x-" in header
    const headerElement = document.querySelector('header');
    if (headerElement) {
      userActions = headerElement.querySelector('div[class*="space-x-"]');
    }
  }
  
  if (!userActions) {
    console.log("Unable to find user actions area");
    return;
  }

  await updateUserActionArea(userActions, user);
}

// Helper function to update user action area
async function updateUserActionArea(userActions, user) {
  // Remove loading state and show content
  userActions.classList.remove('opacity-0');
  userActions.classList.add('opacity-100');
  
  if (user) {
    // User is logged in, show user info and logout button
    let userName = user.email.split('@')[0]; // Default fallback to email username
    
    try {
      // Try to get username from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.username) {
          userName = userData.username;
        }
      }
    } catch (error) {
      console.log("Could not fetch user data from Firestore:", error);
      // Continue with email-based username as fallback
    }
    
    userActions.innerHTML = `
      <span class="px-4 py-2 text-white font-semibold whitespace-nowrap">Welcome, ${userName}</span>
      <button id="logout-btn" class="px-4 py-2 rounded-full border border-white text-white font-semibold hover:bg-sky-600 hover:border-sky-600 transition duration-300 cursor-pointer whitespace-nowrap">Logout</button>
    `;
    
    // Add logout button event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const success = await logOut();
        if (success) {
          // Refresh page to update navigation bar
          window.location.reload();
        }
      });
    }
  } else {
    // User not logged in, show register and login buttons
    // Check current page path to determine correct links
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const signupLink = isInSubfolder ? 'signup.html' : 'pages/signup.html';
    const loginLink = isInSubfolder ? 'login.html' : 'pages/login.html';
    
    userActions.innerHTML = `
      <a href="${signupLink}" class="px-4 py-2 rounded-full border border-white text-white font-semibold hover:bg-sky-600 hover:border-sky-600 transition duration-300 cursor-pointer whitespace-nowrap">Register</a>
      <a href="${loginLink}" class="px-4 py-2 rounded-full bg-white text-sky-900 font-semibold hover:bg-sky-700 hover:text-white transition duration-300 cursor-pointer whitespace-nowrap">Sign in</a>
    `;
  }
}

// Initialize auth state when page loads
export async function initAuthState() {
  const user = await checkAuthState();
  await updateNavigation(user);
}