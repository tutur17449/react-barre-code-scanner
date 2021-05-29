import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

export default function BarreCodeDetails({ barreCode }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      if (barreCode) {
        error && setError(null);
        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${barreCode}.json`
          );
          if (data.status === 0) {
            setError("Product not found");
          } else {
            setData(data.product);
          }
        } catch (err) {
          setError("Product not found");
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [barreCode]);

  if (isLoading)
    return (
      <Grid container>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="default" />
        </div>
      </Grid>
    );

  if (error)
    return (
      <Grid container>
        <Grid item xs={12} style={{ marginTop: "1.5rem" }}>
          <Alert severity="error" onClick={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      </Grid>
    );

  return (
    <Grid container>
      <Grid item xs={12}>
        <h2>Barre code : {barreCode}</h2>
      </Grid>
      <Grid item xs={12} sm={6}>
        <img
          src={data?.image_url}
          alt={data?.product_name}
          style={{ maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {data?.product_name && (
          <p>
            <b>Name :</b> {data.product_name}
          </p>
        )}
        {data?.brands && (
          <p>
            <b>Brands :</b> {data.brands}
          </p>
        )}
        {data?.allergens_from_ingredients && (
          <p>
            <b>Allergens :</b> {data.allergens_from_ingredients}
          </p>
        )}
        {data?.ingredients_text && (
          <p>
            <b>Ingredients :</b> {data.ingredients_text}
          </p>
        )}
        {data?.labels && (
          <p>
            <b>Labels :</b> {data.labels}
          </p>
        )}
      </Grid>
    </Grid>
  );
}
