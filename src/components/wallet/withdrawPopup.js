import CustomButton from "@/components/button";
import Input from "@/components/inputs";
import constants from "@/services/constants";
import { handleFormattedNumberChange } from "@/services/utils";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ChargeWalletDialog = ({
  open,
  onClose,
  amount,
  setAmount,
  onConfirm,
  amountError,
  setAmountError,
}) => {
  const { t } = useTranslation();
  const [amountFormatted, setAmountFormatted] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle>
        {t("components_wallet_charge-dialog.شحن_الرصيد")}
      </DialogTitle>
      <DialogContent>
        <Box spacing={3} mt={1}>
          <Input
            label={t("components_wallet_charge-dialog.مبلغ_الشحن")}
            variant="outlined"
            placeholder={t("components_wallet_charge-dialog.مبلغ_الشحن")}
            value={amountFormatted}
            error={amountError}
            onChange={(e) =>
              handleFormattedNumberChange(
                e.target.value,
                null,
                null,
                setAmount,
                setAmountFormatted
              )
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {constants.symbol({ width: { xs: "15px" } })}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <CustomButton
            customeStyle={{ width: "100%", mt: 3 }}
            handleClick={onConfirm}
            text={t("components_wallet_charge-dialog.زر_شحن")}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChargeWalletDialog;
