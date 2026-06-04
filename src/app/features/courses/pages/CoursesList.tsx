import { useEffect } from "react";
import { useNavigate } from "react-router";

export function CoursesList() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/classes", { replace: true });
  }, [navigate]);

  return null;
}
