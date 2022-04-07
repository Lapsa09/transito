import React, { useEffect, useState } from "react";
import CustomBarchart from "../../../components/ui/CustomBarchart";
import { getDatosPaseo } from "../../../services/controlDiarioService";
import { CustomSelect } from "../../../components/ui";
import { dateNameFormat } from "../../../utils/dates";
import style from "../../../styles/Data.module.css";
import { useForm } from "react-hook-form";

function Datacharts({ data }) {
  const { control, getValues, watch } = useForm();
  const [datas, setDatas] = useState([]);
  const initSelect = () => {
    const f = [...new Set(data.map((d) => d.fecha))];
    return f.map((fe) => {
      return { id: fe, label: dateNameFormat(fe) };
    });
  };

  useEffect(() => {
    setDatas(filterByDay());
  }, [watch("dia")]);

  const filterByDay = () => {
    const select = getValues("dia");

    return data.filter((d) => d.fecha === select);
  };

  const getDefaultValue = () => initSelect().reverse()[0].id;

  return (
    <div className={style.page}>
      <CustomSelect
        control={control}
        name="dia"
        label="Dia"
        options={initSelect()}
        defaultValue={getDefaultValue()}
      />
      <CustomBarchart data={datas} />
    </div>
  );
}

export const getStaticProps = async () => {
  const data = await getDatosPaseo();
  return {
    props: {
      data,
    },
  };
};

export default Datacharts;
