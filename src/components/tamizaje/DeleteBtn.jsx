import { Button, Spinner } from "react-bootstrap";
import { DeleteIcon } from "../../icons";
import { useEffect } from "react";
import { useDeleteTamizaje } from "../../hooks/tamizaje/useDeleteTamizaje";

export const DeleteBtn = ({ refetch, clearChecks, disabled, info }) => {
  const {deleteTamizaje, data, loading, error } = useDeleteTamizaje();

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    console.log("Tamizaje eliminado correctamente");
    refetch();
    clearChecks();
  }, [data]);
  return (
    <Button variant="danger" disabled={disabled || loading} 
      onClick={() => {
        if (!info.incomeId) return;
        deleteTamizaje({
          incomeId: info.incomeId,
        });
      }}
    >
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <DeleteIcon width={20} height={20} />
      )}
    </Button>
  );
};
