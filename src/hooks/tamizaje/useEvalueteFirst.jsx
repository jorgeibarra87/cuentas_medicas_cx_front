import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RUTA_BACK_PRODUCCION } from "../../types";

export const useEvalueteFirst = () => {

  const stateLogin = useSelector(state => state.login);
  const token = `Bearer ${stateLogin.token}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(({ arrPatients, status }) => {
    setLoading(true);
    setData(null);
    setError(null);
    
    fetch(`${RUTA_BACK_PRODUCCION}nutricion/tamizaje/evaluate`, {
      method: "POST",
      body: JSON.stringify({
        arrPatients,
        status,
      }),
      headers: {
        "content-Type": "application/json",
        Authorization: token || "",
      },
    })
      .then((res) => res.json())
      .then((r) => {
        if (r.error) {
          setError(r.error);
          return;
        }
        setData(r);
      })
      .catch((err) => {
        console.log("err", err);
        setError(err.toString());
      })
      .finally(() => setLoading(false));
  }, []);

  return [get, { data, loading, error }];
};
