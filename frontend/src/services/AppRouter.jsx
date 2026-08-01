import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

import Home from "../pages/Home";
import Barcode from "../pages/Barcode";
import Fabric from "../pages/Fabric";
import Login from "../pages/Login";
import Dispatch from "../pages/Dispatch";
import CreateDispatch from "../pages/CreateDispatch";
import DispatchRolls from "../pages/DispatchRolls";
import Stocks from "../pages/Stocks";
import DispatchPreview from "../pages/DispatchPreview";
import FabricRolls from "../components/fabric/FabricRolls";
import DispatchDC from "../components/dispatch/DispatchDC";
import UserManagement from "../pages/UserManagement";

function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Route */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/fabric" element={<Fabric />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/dispatch-list" element={<CreateDispatch />} />
          <Route path="/dispatch/scan" element={<DispatchRolls />} />
          <Route path="/dispatch/preview" element={<DispatchPreview />} />
          <Route path="/dispatch/:id" element={<DispatchDC />} />
          <Route path="/fabric-rolls/:id" element={<FabricRolls />} />

          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UserManagement />} />
          </Route>
          
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;
