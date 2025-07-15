// 用户认证状态管理
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// 检查用户登录状态
export function checkAuthState() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}

// 用户登出
export async function logOut() {
  try {
    await signOut(auth);
    console.log("用户已登出");
    return true;
  } catch (error) {
    console.error("登出错误:", error);
    return false;
  }
}

// 更新导航栏的用户状态显示
export function updateNavigation(user) {
  // 获取导航栏中的用户操作区域 - 更准确的选择器
  const userActions = document.querySelector('header .container .flex.space-x-2.mt-4');
  
  if (!userActions) {
    console.log("找不到用户操作区域，尝试其他选择器");
    // 尝试更通用的选择器
    const alternativeSelector = document.querySelector('header div.flex.space-x-2');
    if (alternativeSelector) {
      console.log("找到备用选择器");
      updateUserActionArea(alternativeSelector, user);
      return;
    }
    console.log("无法找到用户操作区域");
    return;
  }

  updateUserActionArea(userActions, user);
}

// 更新用户操作区域的辅助函数
function updateUserActionArea(userActions, user) {
  if (user) {
    // 用户已登录，显示用户信息和登出按钮
    const userEmail = user.email;
    const userName = userEmail.split('@')[0]; // 简单地从邮箱提取用户名
    
    userActions.innerHTML = `
      <span class="px-4 py-2 text-white font-semibold">欢迎, ${userName}</span>
      <button id="logout-btn" class="px-4 py-2 rounded-full border border-white text-white font-semibold hover:bg-sky-600 hover:border-sky-600 transition duration-300 cursor-pointer">登出</button>
    `;
    
    // 添加登出按钮事件监听器
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const success = await logOut();
        if (success) {
          // 刷新页面以更新导航栏
          window.location.reload();
        }
      });
    }
  } else {
    // 用户未登录，显示注册和登录按钮
    // 检查当前页面路径以确定正确的链接
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const signupLink = isInSubfolder ? 'signup.html' : 'pages/signup.html';
    const loginLink = isInSubfolder ? 'login.html' : 'pages/login.html';
    
    userActions.innerHTML = `
      <a href="${signupLink}" class="px-4 py-2 rounded-full border border-white text-white font-semibold hover:bg-sky-600 hover:border-sky-600 transition duration-300 cursor-pointer">注册</a>
      <a href="${loginLink}" class="px-4 py-2 rounded-full bg-white text-sky-900 font-semibold hover:bg-sky-700 hover:text-white transition duration-300 cursor-pointer">登录</a>
    `;
  }
}

// 在页面加载时检查用户状态
export function initAuthState() {
  checkAuthState().then(user => {
    updateNavigation(user);
  });
}