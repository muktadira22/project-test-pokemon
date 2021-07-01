import React, { Children } from "react";
import { Layout } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PokemonLogo from "@/assets/img/pokemon-logo.png";

const { Header, Footer, Content } = Layout;

const Wrapper = ({ children }) => {
  return (
    <Layout className="pokemon-layout">
      <Header className="pokemon-layout__header">
        <LazyLoadImage
          src={PokemonLogo}
          alt="pokemon-logo"
          className="pokemon-logo"
        />
      </Header>
      <Content className="pokemon-layout__content">{children}</Content>
      <Footer className="pokemon-layout__footer">
        Copyright 2021 @ Muhammad Aria Muktadir
      </Footer>
    </Layout>
  );
};

export default Wrapper;
