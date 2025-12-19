import { Navigate } from "react-router-dom";

function ProtectedRoute({session, children}) {
    return session ? children : <Navigate to="/auth" replace />
}

export default ProtectedRoute