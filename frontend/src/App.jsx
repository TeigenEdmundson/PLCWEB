import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import MainPage from './components/posts';
import HomePage from './components/home';

const queryClient = new QueryClient();

function NotFound(){
  return <h1>WTF DID YOU DO? I WORKED REALLY HARD ON THIS SHIT AND YOU FUCKED IT UP 404</h1>
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
