document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');
}, false);

// const login = document.querySelector('.login-page');
// const signup = document.querySelector('.signup-page');


// const signUpPage = () => {
//   signup.style.display = 'block';
//   login.style.opacity = '0';
//   setTimeout(() => {
//     signup.style.opacity = '1';
//     login.style.display = 'none';
  
//   }, 500);
// };
const signUpPage = () => {
  let baseurl = window.location.origin;
  window.location.href = baseurl + "/signup"
}