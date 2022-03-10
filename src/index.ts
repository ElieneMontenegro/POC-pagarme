import axios from "axios";
import express from "express";
import { Request, Response } from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8080, () => {
  console.log("server working on port 8080");
  console.log("go to http://localhost:8080");
});

app.get("/", (req: Request, res: Response) => {
  return res.json("hello world");
});

//pagarme
const api_key = "sk_test_mLVW3yzfytn59e3v";

const authorization = "Basic " + Buffer.from(`${api_key}:`!).toString("base64");

const testePagarme = async () => {
  const client = {
    name: "Tony Stark",
    email: "tonystarkk@avengers.com",
    code: "MY_CUSTOMER_001",
    document: "93095135270",
    type: "individual",
    document_type: "CPF",
    phones: {
      mobile_phone: {
        country_code: "55",
        area_code: "21",
        number: "000000000",
      },
    },
  };

  try {
    const clientCreated = await axios.post(
      "https://api.pagar.me/core/v5/customers",
      client,
      {
        headers: { authorization },
      }
    );
    const customer_id = clientCreated.data.id;

    const card = {
      number: "4000000000000010",
      exp_month: 1,
      exp_year: 30,
      cvv: "3531",
      options: {
        verify_card: true,
      },
    };

    const cardCreated = await axios.post(
      `https://api.pagar.me/core/v5/customers/${customer_id}/cards`,
      card,
      {
        headers: { authorization },
      }
    );

    const payment = {
      items: [
        {
          amount: 2990,
          description: "Chaveiro do Tesseract",
          quantity: 1,
          code: "abc",
        },
      ],
      customer_id,
      payments: [
        {
          payment_method: "boleto",
          boleto: {},
        },
      ],
    };

    const paymentResult = await axios.post(
      "https://api.pagar.me/core/v5/orders/",
      payment,
      {
        headers: { authorization },
      }
    );
    console.log("result :>> ", paymentResult.data.charges[0].last_transaction);
  } catch (error) {
    console.log("error.response :>> ", error.response.data);
  }
};

testePagarme();
