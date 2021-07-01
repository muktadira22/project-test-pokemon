import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Descriptions, Progress, Button } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getApi, fetchPokemon } from "@/helpers/HttpRequest";
import { Link } from "react-router-dom";

const { Meta } = Card;

const initialState = {
  data: {},
};

const Detail = ({
  match: {
    params: { id },
  },
}) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const RenderTypeImage = ({ data }) => {
    const typeName = require(`../../assets/img/type-icons/${data}.svg`);
    return <LazyLoadImage src={typeName} className="type-icon" />;
  };
  useEffect(() => {
    setLoading(true);

    fetchPokemon({
      url: getApi(id),
      success: (data) => {
        console.log(data);
        setState((prevState) => ({
          ...prevState,
          data,
        }));
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        setLoading(false);
      },
    });
  }, []);
  return (
    <Spin spinning={loading}>
      <div className="pokemon-detail">
        <button className="btn-pokemon">
          <Link to="/">Kembali</Link>
        </button>
        <Card className="pokemon-card">
          <Row gutter={[24, 24]}>
            <Col sm={24} md={12}>
              <LazyLoadImage
                alt={"example"}
                src={`https://pokeres.bastionbot.org/images/pokemon/${id}.png`}
                effect="blur"
              />
            </Col>
            <Col sm={24} md={12}>
              <Descriptions title={state.data.name} bordered layout="vertical">
                <Descriptions.Item label="Base Experience" span={2}>
                  <span className="base-experience">
                    {state.data.base_experience}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label="Types"
                  style={{ textAlign: "center" }}
                >
                  {Array.isArray(state.data.types) &&
                    state.data.types.length >= 0 &&
                    state.data.types.map((item, key) => (
                      <Col
                        sm={24}
                        md={24 / state.data.types.length}
                        key={key}
                        className="types"
                      >
                        <RenderTypeImage data={item.type.name} />
                        <br />
                        <span>{item.type.name}</span>
                      </Col>
                    ))}
                </Descriptions.Item>

                <Descriptions.Item label="Stats" className="stats-detail">
                  {Array.isArray(state.data.stats) &&
                    state.data.stats.length >= 0 &&
                    state.data.stats.map((item, key) => (
                      <div key={key}>
                        <span className="stat-title">{item.stat.name}</span>
                        <Row className="stat-base">
                          <Col sm={24} md={4}>
                            <span>Base Stat</span>
                          </Col>
                          <Col sm={24} md={20}>
                            <Progress
                              percent={item.base_stat}
                              format={(percent) => {
                                return (
                                  <b style={{ color: "#FFDE00" }}>{percent}</b>
                                );
                              }}
                              strokeWidth={15}
                              strokeColor="#FFDE00"
                            />
                          </Col>
                        </Row>

                        <Row className="stat-effort">
                          <Col sm={24} md={4}>
                            <span>Effort</span>
                          </Col>
                          <Col sm={24} md={20}>
                            <Progress
                              percent={item.effort}
                              format={(percent) => {
                                return (
                                  <b style={{ color: " #CC0000" }}>{percent}</b>
                                );
                              }}
                              strokeWidth={15}
                              strokeColor=" #CC0000"
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </div>
    </Spin>
  );
};

export default Detail;
