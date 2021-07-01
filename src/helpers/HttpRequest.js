import axios from "axios";

const api = "https://pokeapi.co/api/v2/pokemon";
const getApi = (params = "") => {
  return `${api}/${params}`;
};

const fetchPokemon = ({
  url,
  success = undefined,
  error = undefined,
  complete = undefined,
}) => {
  axios
    .get(url)
    .then((res) => {
      success(res.data);
    })
    .catch((err) => {
      error(err);
    })
    .then(() => {
      complete();
    });
};
export { getApi, fetchPokemon };
