import Ptongquan from './pages/Ptongquan';
import PLoaicongviec from './pages/PLoaicongviec';
import { Routes, Route } from 'react-router-dom';
import PDangnhap from './pages/PDangnhap';
import PDangky from './pages/PDangky';
import PCongviec from './pages/PCongviec';
import PrivateRoute from './components/PrivateRoute';
import PLichsu from './pages/PLichsuthaydoi';
import PDoimatkhau from './pages/PDoimatkhau';
import PQuenmatkhau from './pages/PQuenmatkhau';
import PDatlaimk from './pages/PDatlaimk';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PDangnhap />} />
      <Route path="/dangky" element={<PDangky />} />
      <Route path="/quenmatkhau" element={<PQuenmatkhau />} />
      <Route path="/datlaimatkhau" element={<PDatlaimk />} />

      {/* Private routes */}
      <Route path="/tongquan" element={
        <PrivateRoute><Ptongquan /></PrivateRoute>
      } />
      <Route path="/loaicongviec" element={
        <PrivateRoute><PLoaicongviec /></PrivateRoute>
      } />
      <Route path="/congviec" element={
        <PrivateRoute><PCongviec /></PrivateRoute>
      } />
      <Route path="/lichsu" element={
        <PrivateRoute><PLichsu /></PrivateRoute>
      } />
      <Route path="/doimatkhau" element={
        <PrivateRoute><PDoimatkhau /></PrivateRoute>
      } />

    </Routes>
  );
}

export default App;
