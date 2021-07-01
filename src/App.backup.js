import React, { useEffect, useState } from "react";
import { Card, Row, Col, Layout, Icon, Input } from "antd";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PokemonLogo from "./assets/img/pokemon-logo.png";

const { Meta } = Card;
const { Header, Footer, Content } = Layout;
const { Search } = Input;

const initialState = {
  data: [],
  loading: true,
};

const initialParams = {
  page: 1,
  limit: 30,
};

export function App() {
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [params, setParams] = useState(initialParams);
  const [state, setState] = useState(initialState);

  const renderPokemon = async (url) => {
    return await axios.get(url);
  };

  const fetchData = () => {
    setState(initialState);
    axios
      .get(
        `${url}?offset=${(params.page - 1) * params.limit}&limit=${
          params.limit
        }`
      )
      .then((response) => {
        let res = response.data;
        res.results.map(async (item) => {
          let detailResponse = await renderPokemon(item.url);
          setState((prevState) => ({
            ...prevState,
            data: [...prevState.data, { ...item, detail: detailResponse.data }],
          }));
        });
      });
  };

  const fetchSearch = (value) => {
    setState(initialState);
    axios.get(`${url}/${value}`).then((response) => {
      let res = response.data;
      setState((prevState) => ({
        ...prevState,
        data: [
          {
            name: value,
            detail: res,
          },
        ],
      }));
    });
  };

  const paginationClick = (status) => {
    let page = status === "next" ? (params.page += 1) : (params.page -= 1);
    console.log(page);
    setParams((prevState) => ({
      ...prevState,
      page,
    }));
    fetchData();
  };

  const searchPokemon = (value) => {
    if (value !== "" && value !== null) {
      fetchSearch(value);
    } else {
      setParams(initialParams);
      fetchData();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout className="pokemon-layout">
      <Header className="pokemon-layout__header">
        <LazyLoadImage
          src={PokemonLogo}
          alt="pokemon-logo"
          className="pokemon-logo"
        />
      </Header>
      <Content className="pokemon-layout__content">
        <Row>
          <Col sm={24} md={12}>
            <Search placeholder="input search text" onSearch={searchPokemon} />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {Array.isArray(state.data) &&
            state.data.length >= 0 &&
            state.data.map((item, key) => (
              <Col
                key={key}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                className="pokemon-col"
              >
                <Card
                  className="pokemon-card"
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <LazyLoadImage
                      alt={"example"}
                      src={`https://pokeres.bastionbot.org/images/pokemon/${item.detail.id}.png`}
                    />
                  }
                >
                  <Meta title={item.name} />
                </Card>
              </Col>
            ))}
        </Row>
        <Row>
          <Col span={24} className="pokemon-pagination">
            <button
              className="pokemon-pagination__btn"
              onClick={() => paginationClick("prev")}
            >
              <Icon type="left" />
            </button>
            <span className="pokemon-pagination__count">{params.page}</span>
            <button
              className="pokemon-pagination__btn"
              onClick={() => paginationClick("next")}
            >
              <Icon type="right" />
            </button>
          </Col>
        </Row>
      </Content>
      <Footer className="pokemon-layout__footer">
        Copyright 2021 @ Muhammad Aria Muktadir
      </Footer>
    </Layout>
  );
}
