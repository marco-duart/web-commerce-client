import React from "react";
import { useFormContext } from "react-hook-form";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import * as S from "./styles";
import { type CheckoutFormDataUnion } from "../../utils/checkout-resolvers";

const COUNTRY_FLAGS: Record<string, { flag: string; name: string; ddi: string }> = {
  BR: { flag: "🇧🇷", name: "Brasil", ddi: "+55" },
  USA: { flag: "🇺🇸", name: "Estados Unidos", ddi: "+1" },
  PT: { flag: "🇵🇹", name: "Portugal", ddi: "+351" },
};

export const ClientForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<CheckoutFormDataUnion>();
  
  const { selectedCountry } = useRegionalConfig();
  const ddi = watch("ddi");
  
  const countryInfo = selectedCountry ? COUNTRY_FLAGS[selectedCountry] : null;

  return (
    <S.FormGrid>
      <S.GridItem span={12}>
        <S.FormGroup>
          <S.Label htmlFor="name">Nome Completo</S.Label>
          <S.Input
            id="name"
            type="text"
            placeholder="* Nome"
            hasError={!!errors.name}
            {...register("name")}
          />
          {errors.name && errors.name.message && (
            <S.ErrorMessage>{errors.name.message as string}</S.ErrorMessage>
          )}
        </S.FormGroup>
      </S.GridItem>

      <S.GridItem span={6}>
        <S.FormGroup>
          <S.Label htmlFor="document">Documento</S.Label>
          <S.Input
            id="document"
            type="text"
            placeholder="Documento"
            maxLength={14}
            hasError={!!errors.document}
            {...register("document")}
          />
          {errors.document && errors.document.message && (
            <S.ErrorMessage>{errors.document.message as string}</S.ErrorMessage>
          )}
        </S.FormGroup>
      </S.GridItem>

      <S.GridItem span={6}>
        <S.FormGroup>
          <S.Label htmlFor="email">E-mail</S.Label>
          <S.Input
            id="email"
            type="email"
            placeholder="* E-mail"
            hasError={!!errors.email}
            {...register("email")}
          />
          {errors.email && errors.email.message && (
            <S.ErrorMessage>{errors.email.message as string}</S.ErrorMessage>
          )}
        </S.FormGroup>
      </S.GridItem>

      <S.GridItem span={12}>
        <S.FormGroup>
          <S.Label>Celular / WhatsApp</S.Label>
          <S.PhoneWrapper>
            <S.DDILabel>
              <span>{countryInfo?.flag}</span>
              <span>{ddi}</span>
            </S.DDILabel>
            <input
              type="hidden"
              {...register("ddi")}
            />

            <S.Input
              type="tel"
              placeholder="* Celular"
              maxLength={15}
              hasError={!!errors.phone}
              {...register("phone")}
            />
          </S.PhoneWrapper>
          {errors.phone && errors.phone.message && (
            <S.ErrorMessage>{errors.phone.message as string}</S.ErrorMessage>
          )}
        </S.FormGroup>
      </S.GridItem>
    </S.FormGrid>
  );
};
