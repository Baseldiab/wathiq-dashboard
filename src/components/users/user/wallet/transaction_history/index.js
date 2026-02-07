import { useTranslation } from "next-i18next";
import React from "react";
import Custom_Card from "../../Card";

export default function TransctionHistory() {
  const { t } = useTranslation();
  const activitiesData = [
  {
    id: 1,
    title: t("components_users_user_wallet_transaction_history_index.سحب_رصيد"),
    amount: t("components_users_user_wallet_transaction_history_index.رس"),
    status: t("components_users_user_wallet_transaction_history_index.قيد_المعالجة"),
    date: t("components_users_user_wallet_transaction_history_index.سبتمبر"),
    description: t("components_users_user_wallet_transaction_history_index.الرصيد_بعد_المعاملة_رس"),
    // checked: true,
  },
  {
    id: 2,
    title: t("components_users_user_wallet_transaction_history_index.إيداع_رصيد"),
    amount: t("components_users_user_wallet_transaction_history_index.رس"),
    status: t("components_users_user_wallet_transaction_history_index.تمت_المعالجة"),
    date: t("components_users_user_wallet_transaction_history_index.سبتمبر"),
    description: t("components_users_user_wallet_transaction_history_index.الرصيد_بعد_المعاملة_رس"),
    // checked: false,
  },
];

  return (
    <>
      {activitiesData.map((activity) => (
        <Custom_Card
          key={activity.id}
          title={activity.title}
          description={activity.description}
          date={activity.date}
          amount={activity.amount}
          status={activity.status}
          type={"wallet"}
          onClick={() => {}}
        />
      ))}
    </>
  );
}
