const axios = require("axios");
const { GraphQLClient, gql } = require("graphql-request");
const { Headers } = require("cross-fetch");

global.Header = global.Headers || Headers;

module.exports = {
  getOrder: async (req, res) => {
    try {
      let cursor = null;
      let allData = [];

      const endpoint = `https://${process.env.SHOP_NAME}.myshopify.com/admin/api/2022-04/graphql.json`;

      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
        },
      });

      const query = gql`
      query($numProducts: Int!, $cursor: String){
        orders(
           first: $numProducts,
           after: $cursor,
           query:"
           created_at:>'${req.query.after}T00:00:00Z' 
           created_at:<'${req.query.before}T23:59:59Z'
           " ) {
                edges {
                  node {
                    id
                    name
                    createdAt
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                }
              }
            }
            `;

      while (true) {
        const queryData = await graphQLClient.request(query, {
          numProducts: 5,
          cursor: cursor,
        });
        let nextPage = queryData.orders.pageInfo.hasNextPage;
        cursor = queryData.orders.pageInfo.endCursor;
        let myProductData = queryData.orders.edges;
        allData = allData.concat(myProductData);
        if (nextPage == false) {
          break;
        }
      }
      console.log("ALLDATA--->", allData);
      res.status(200).send(allData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "ERROR" });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      let cursor = null;
      let allData = [];

      const endpoint = `https://${process.env.SHOP_NAME}.myshopify.com/admin/api/2022-04/graphql.json`;

      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
        },
      });

      const query = gql`
      query($numProducts: Int!, $cursor: String){
        products(
          first: $numProducts,
          after: $cursor
          sortKey:TITLE,
          query:"
          created_at:>'${req.query.after}T00:00:00Z' 
          created_at:<'${req.query.before}T23:59:59Z'
          ",
          ){
            edges {
              cursor 
              node {
                id
                title
                handle
                createdAt
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
            }
          },
          
        }
            `;

      while (true) {
        const queryData = await graphQLClient.request(query, {
          numProducts: 5,
          cursor: cursor,
        });
        let nextPage = queryData.products.pageInfo.hasNextPage;
        cursor = queryData.products.pageInfo.endCursor;
        let myProductData = queryData.products.edges;
        allData = allData.concat(myProductData);
        if (nextPage == false) {
          break;
        }
      }
      console.log("ALLDATA--->", allData);
      res.status(200).send(allData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "ERROR" });
    }
  },
};
