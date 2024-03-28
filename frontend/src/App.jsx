import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Navigate, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MainPage from './components/posts';
import HomePage from './components/home';

const queryClient = new QueryClient();

function NotFound(){
  return (<div style={{display:"flex", flexDirection:"column", alignContent:"center", backgroundColor:"black", height:600}}>
    <h1 style={{maxWidth: 700, padding:5}}>WTF DID YOU DO? I WORKED REALLY HARD ON THIS SHIT AND YOU FUCKED IT UP 404</h1>
    <Link to="/posts" style={{display: "flex", flexDirection:"row", justifyContent:"center", alignSelf:"center", backgroundColor:"#1d1d1d", padding: 10, borderRadius:20, fontWeight:"bold", width:200}}><span>back to home</span></Link>
    </div>)
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/posts" element={<MainPage/>}/>
          <Route path="/posts/:postId" element={<MainPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="error/404" element={<NotFound/>}/>
          <Route path="*" element={<Navigate to="error/404"/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
