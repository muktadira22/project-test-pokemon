import React, { useEffect, useState, Fragment } from "react";
import { Card, Row, Col, Icon, Input, Spin } from "antd";
import axios from "axios";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { getApi, fetchPokemon } from "@/helpers/HttpRequest";

import { Link } from "react-router-dom";

const { Meta } = Card;
const { Search } = Input;

const initialState = {
  data: [],
};

const initialParams = {
  page: 1,
  limit: 30,
};

const List = ({ scrollPosition }) => {
  const [params, setParams] = useState(initialParams);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const renderPokemon = async (url) => {
    return await axios.get(url);
  };

  const fetchData = () => {
    setState(initialState);
    setLoading(true);
    fetchPokemon({
      url: getApi(
        `?offset=${(params.page - 1) * params.limit}&limit=${params.limit}`
      ),
      success: (data) => {
        data.results.map(async (item) => {
          let detailResponse = await renderPokemon(item.url);
          setState((prevState) => ({
            ...prevState,
            data: [...prevState.data, { ...item, detail: detailResponse.data }],
          }));
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const fetchSearch = (value) => {
    setState(initialState);
    setLoading(true);

    fetchPokemon({
      url: getApi(value),
      success: (data) => {
        setState((prevState) => ({
          ...prevState,
          data: [
            {
              name: value,
              detail: data,
            },
          ],
        }));
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const paginationClick = (status) => {
    setParams((prevState) => ({
      ...prevState,
      page: status === "next" ? (params.page += 1) : (params.page -= 1),
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
    <Fragment>
      <Row>
        <Col sm={24} md={{ span: 12, offset: 6 }}>
          <Search
            placeholder="Cari Pokemon"
            onSearch={searchPokemon}
            className="search-pokemon"
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Spin spinning={loading}>
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
                <Link to={`/${item.detail.id}`}>
                  <Card
                    className="pokemon-card pokemon-card-hovered"
                    hoverable
                    style={{ width: 240 }}
                    cover={
                      <LazyLoadImage
                        alt={"example"}
                        src={`https://pokeres.bastionbot.org/images/pokemon/${item.detail.id}.png`}
                        scrollPosition={scrollPosition}
                        effect="blur"
                      />
                    }
                  >
                    <Meta title={item.name} />
                  </Card>
                </Link>
              </Col>
            ))}
        </Spin>
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
    </Fragment>
  );
};

export default trackWindowScroll(List);
