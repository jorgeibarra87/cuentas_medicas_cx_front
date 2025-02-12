/* eslint-disable react/prop-types */
import { Button, Spinner } from "react-bootstrap";
import { DeleteIcon } from "../../icons";
import { useEffect } from "react";
import { useDeleteTamizaje } from "../../hooks/tamizaje/useDeleteTamizaje";

export const DeleteBtn = ({ refetch, clearChecks, disabled, info }) => {
  const [onDelete, { data, loading, error }] = useDeleteTamizaje();

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    if (data?.id > 0) {
      console.log("Tamizaje eliminado correctamente");
      refetch();
      clearChecks();
    } else if (data.error) {
      console.log(data.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <Button variant="danger" disabled={disabled || loading} 
      onClick={() => {
        console.log("info", info);
        if (!info.incomeId) return;
        onDelete({
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
