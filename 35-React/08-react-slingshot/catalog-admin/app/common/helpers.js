import config from '../config/appConfig';

String.prototype.format = function() {
  let i = 0;
  const args = arguments;
  return this.replace(/{}/g, () =>
    typeof args[i] !== 'undefined' ? args[i++] : '',
  );
};

export function redirectToDashboard() {
  const params = new URL(document.location).search;
  const navigateTo = params ? params.replace('?next=', '') : 'home';
  window.location.replace(`${config.ROOT_URL}${navigateTo}`);
}

export function isLogin() {
  // Clear local storage
  return window.localStorage.getItem('user');
}

export function redirectToLogin() {
  // Clear local storage
  window.localStorage.clear();
  // Redirect to login page
  window.location.replace(`${config.ROOT_URL}login`);
}

export function redirectToOrderHistory() {
  // lead the user to order history page
  console.log('order-history page is not availabe');
  // window.location.replace(`${config.ROOT_URL}order-history`);
}
export function redirectToInviteUsers() {
  console.log('invite-user page is not available');
  // window.location.replace(`${config.ROOT_URL}invite-users`);
}

export function isUserLoggedIn() {
  return localStorage.getItem('user');
}

export function buildConditionalString(
  initialValues,
  trueValue,
  condition = true,
  falseValue = '',
  defaultSeparator = ' ',
) {
  return `${initialValues}${defaultSeparator}${
    condition ? trueValue : falseValue
  }`;
}

export function recordUserSession() {
  const script = document.createElement('script');
  script.innerHTML = `(function() {
         window.__insp = window.__insp || [];
        __insp.push(['wid', ${config.INSPECTLET_KEY}]);
        var ldinsp = function(){
          if(typeof window.__inspld != "undefined") return;
          window.__inspld = 1;
          var insp = document.createElement('script');
          insp.type = 'text/javascript';
          insp.async = true;
          insp.id = "inspsync";
          insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=249101392&r=' + Math.floor(new Date().getTime()/3600000);
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(insp, x);
        };
        setTimeout(ldinsp, 0);
      })();
      `;
  document.head.appendChild(script);
}

export function isMobile() {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/) ||
    navigator.userAgent.match(/Windows Phone/i) ||
    navigator.userAgent.match(/ZuneWP7/i)
  );
}

export function isIE() {
  const userBrowser = window.navigator.userAgent;
  const ieBrowser = userBrowser.indexOf('MSIE ');
  return ieBrowser > 0;
}

export function getCurrentLocalTime(epochTime = null) {
  let d = new Date();
  if (epochTime) d = new Date(epochTime);
  return d.toLocaleDateString();
}
