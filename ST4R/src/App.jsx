// src/App.jsx 경로 수정
import Routes from '../routes/Router.jsx'; // 상대 경로 수정

function App() {
  console.log('App 컴포넌트가 렌더링됨');

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
