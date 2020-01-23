// import '../css/index.css';
// 有些語法 ie 不支援，所以要靠 @babel/polyfill 來解決 ie 的問題
// 例如: Promise
import '@babel/polyfill';
import axios from 'axios';
import '../scss/index.scss';
// 使用 file-loader 才需將 html 引入
// import '../index.html';

// let arr = [1, 2, 3];
// arr.forEach(i => console.log(i));

axios.get('/api/GetLstDicArea').then(res => console.log(res.data));
