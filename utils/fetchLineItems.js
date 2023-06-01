import axios from "axios";

export const fetchLineItems = async (sessionId, tokenYek) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/checkout-session/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${tokenYek}`,
      },
    }
  );

  if (data.status !== "success") {
    return null;
  }

  return data.lineItems;
};
