export const calculateInstallment = (
  principal: number,
  installments: number,
  monthlyRate: number = 0.0349,
) => {
  if (installments <= 1) {
    return {
      total: principal,
      installmentValue: principal,
    };
  }

  const i = monthlyRate;
  const n = installments;

  const installmentValue =
    (principal * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);

  const total = installmentValue * n;

  return {
    total: Number(total.toFixed(2)),
    installmentValue: Number(installmentValue.toFixed(2)),
  };
};
