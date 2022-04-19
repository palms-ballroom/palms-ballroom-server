const { ApolloServer, gql } = require("apollo-server");
const userUrl = "http://localhost:3001";
const ballroomUrl = "http://localhost:4001";
const redis = require("./config/redis");
const axios = require("axios");
const PORT = process.env.PORT || 4000;

const typeDefs = gql`
  type User {
    id: ID
    username: String
    email: String
    password: String
    phoneNumber: String
    imageUrl: String
    address: String
    role: String
    createdAt: String
    updatedAt: String
  }

  type BookInfo {
    customerId: String
    date: String
  }

  type Ballroom {
    _id: ID
    hotelApiId: ID
    userId: ID
    name: String
    pricePerHour: Int
    pricePerDay: Int
    mainImg: String
    images1: String
    images2: String
    images3: String
    images4: String
    clicked: Int
    city: String
    booked: [BookInfo]
  }

  type DataInvoices {
    external_id: Int
    status: String
    amount: Int
    payer_email: String
    invoice_url: String
  }

  type XenditInvoices {
    message: String
    data: DataInvoices
  }

  type LoginInfo {
    msg: String
    token: String
    id: Int
    email: String
    role: String
  }
  type Transaction {
    id: ID
    hotelId: String
    price: Int
    status: String
    bookDateStart: String
    bookDateEnd: String
    customerId: Int
    createdAt: String
    updatedAt: String
  }

  type Query {
    getUsers: [User] #aman
    getUserById(id: ID!): User #belum ada di servernya
    getBallrooms: [Ballroom] #aman
    getBallroomByHotelId(hotelApiId: ID!): Ballroom #aman
    userTransactions(access_token: String): [Transaction]
    hotelTransactions(access_token: String, hotelApiId: ID!): [Transaction]
  }
  type Mutation {
    registerUser(access_token: String, imageUrl: String, email: String, username: String, password: String, phoneNumber: String, address: String): String #aman
    registerCustomer(imageUrl: String, email: String, username: String, password: String, phoneNumber: String, address: String): String #aman
    loginUser(email: String, password: String): LoginInfo #aman
    addBallroom(
      hotelApiId: ID!
      name: String
      pricePerHour: Int
      pricePerDay: Int
      mainImg: String
      images1: String
      images2: String
      images3: String
      city: String
    ): String #aman
    updateBallroom(
      hotelApiId: ID!
      name: String
      pricePerHour: Int
      pricePerDay: Int
      mainImg: String
      images1: String
      images2: String
      images3: String
      city: String
    ): String #aman
    deleteBallroom(hotelApiId: ID!): String #aman
    bookingBallroom(access_token: String, customerId: ID!, hotelApiId: ID!, bookingDate: String!, name: String, role: String): String #aman
    createInvoice(access_token: String, customerId: ID!, price: Int): XenditInvoices
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const response = await axios.get(`${userUrl}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getUserById: async (_, args) => {
      try {
        const response = await axios.get(`${userUrl}/${args.id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getBallrooms: async () => {
      try {
        const response = await axios.get(`${ballroomUrl}/ballroom`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getBallroomByHotelId: async (_, args) => {
      try {
        const response = await axios.get(`${ballroomUrl}/ballroom/${args.hotelApiId}`);
        if (response.status !== 200) {
          return response.data.message;
        }
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    userTransactions: async (_, args) => {
      try {
        const response = await axios({
          method: "get",
          url: `${userUrl}/ballroom`,
          headers: {
            access_token: args.access_token,
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    hotelTransactions: async (_, args) => {
      try {
        const response = await axios({
          method: "get",
          url: `${userUrl}/ballroom/${args.hotelApiId}`,
          headers: {
            access_token: args.access_token,
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    registerCustomer: async (_, args) => {
      try {
        console.log(args);
        const response = await axios({
          method: "post",
          url: `${userUrl}/registerCustomer`,
          data: {
            email: args.email,
            username: args.username,
            password: args.password,
            imageUrl: args.imageUrl,
            phoneNumber: args.phoneNumber,
            address: args.address,
          },
        });
        return "Customer add Succesfully";
      } catch (error) {
        console.log(error);
      }
    },
    registerUser: async (_, args) => {
      try {
        const response = await axios({
          method: "post",
          url: `${userUrl}/register`,
          headers: {
            access_token: args.access_token,
          },
          data: {
            email: args.email,
            username: args.username,
            password: args.password,
            imageUrl: args.imageUrl,
            phoneNumber: args.phoneNumber,
            address: args.address,
          },
        });
        return "Create Successfull";
      } catch (error) {
        console.log(error);
      }
    },
    loginUser: async (_, args) => {
      try {
        const response = await axios.post(`${userUrl}/login`, args);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    addBallroom: async (_, args) => {
      try {
        const response = await axios({
          method: "post",
          url: `${ballroomUrl}/ballroom`,
          data: args,
        });
        return "Ballroom Created Successfully";
      } catch (error) {
        console.log(error);
      }
    },
    updateBallroom: async (_, args) => {
      const response = await axios({
        method: "put",
        url: `${ballroomUrl}/ballroom/${args.hotelApiId}`,
        data: args,
      });
      return "Ballroom Updated Successfully";
    },
    deleteBallroom: async (_, args) => {
      const response = await axios({
        method: "delete",
        url: `${ballroomUrl}/ballroom/${args.hotelApiId}`,
      });
      return "Ballroom Deleted Successfully";
    },
    bookingBallroom: async (_, args) => {
      try {
        if (args.role !== "Customer") {
          return "You are not a customer";
        }
        const ballroom = await axios({
          method: "post",
          url: `${ballroomUrl}/ballroom/transaction/${args.hotelApiId}`,
          data: args,
        });
        const { bookDateStart, price } = ballroom.data.data;
        const transaction = await axios({
          method: "post",
          url: `${userUrl}/ballroom/${args.hotelApiId}`,
          headers: {
            access_token: args.access_token,
          },
          data: {
            bookDateStart,
            price,
          },
        });
        return transaction.data.msg;
      } catch (error) {
        // console.log(error.response.data.message);
        return error.response.data.message;
      }
    },
    createInvoice: async (_, args) => {
      try {
        const response = await axios({
          method: "post",
          url: `${userUrl}/xendit`,
          headers: {
            access_token: args.access_token,
          },
          data: args,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
