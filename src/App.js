/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./App.css";
import { getRelatedRecords } from "./functions/functions";

function App(data) {
  const module = data.data.Entity;
  const registerID = data.data.EntityId;
  const [datos, setDatos] = useState([]);
  const [fechasEspecificas, setFechasEspecificas] = useState("");
  const [tieneFechas, setTieneFechas] = useState("");
  const [cuales, setCuales] = useState("");
  const [masInfo, setMasInfo] = useState("");
  const [tema, setTema] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [workdrive, setWorkdrive] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [comentario, setComentario] = useState("");
  const [fields, setFields] = useState([]);
  const [coordId, setCoordId] = useState("");
  const [formData, setFormData] = useState({
    Tiene_fechas_espec_ficas: "",
    Fecha_especifica_mas_proxima: "",
    Cu_les_son_las_fechas_espec_ficas: "",
    Debe_el_cliente_enviar_mas_informacion: "",
    Tema_del_Proyecto: "",
    Cantidad_de_Adjuntos: "",
    Fecha_Final_de_Entrega: "",
    Comentario_cerrado_nuevas_pautas: "",
  });

  console.log(coordId);

  const getFields = (entrity) => {
    return new Promise(function (resolve, reject) {
      console.log("EJECUCION GETFILDS");
      window.ZOHO.CRM.META.getFields({ Entity: "Deals" })
        .then(function (response) {
          setFields(response.fields);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };

  const getFieldValues = (fields, apiName) => {
    const field = fields.find((item) => item.api_name === apiName);
    return field ? field.pick_list_values || [] : [];
  };

  const fechas = getFieldValues(fields, "Tiene_fechas_espec_ficas");
  const aportado = getFieldValues(
    fields,
    "El_cliente_ha_aportado_toda_la_informaci_n_o_a_n"
  );

  useEffect(() => {
    console.log("EJECUCION RESIZE");
    window.ZOHO.CRM.UI.Resize({ height: "90%", width: "80%" });
  }, []);
  useEffect(() => {
    console.log("EJECUCION RELATERECORD");
    getRelatedRecords("Gestiones", registerID, "Coordinaciones_asociadas")
      .then(function (result) {
        const datos = result.register;
        const filtrado = datos.filter((r) => r.Venta_anticipada === "SI");
        setDatos(filtrado);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [module, registerID]);
  useEffect(() => {
    if (datos && datos.length > 0) {
      // Asegúrate de que 'datos' no sea vacío o 'undefined'
      const firstRecord = datos[0]; // Asumamos que `datos` es un array
      setCantidad(firstRecord.Cantidad_de_Adjuntos || ""); // Proporciona un valor por defecto
      setComentario(firstRecord.Comentario_cerrado_nuevas_pautas || "");
      setCuales(firstRecord.Cu_les_son_las_fechas_espec_ficas || "");
      setFechaFinal(firstRecord.Fecha_Final_de_Entrega || "");
      setFechasEspecificas(firstRecord.Fecha_especifica_mas_proxima || "");
      setMasInfo(firstRecord.Debe_el_cliente_enviar_mas_informacion || "");
      setTema(firstRecord.Tema_del_Proyecto || "");
      setWorkdrive(firstRecord.Workdrive_vendedor || "");
      setTieneFechas(firstRecord.Tiene_fechas_espec_ficas || "");
      setCoordId(firstRecord.id || "");
    }
  }, [datos]);
  useEffect(() => {
    getFields();
    setFormData({
      ...formData,
      Tiene_fechas_espec_ficas: tieneFechas,
      Fecha_especifica_mas_proxima: fechasEspecificas,
      Cu_les_son_las_fechas_espec_ficas: cuales,
      Debe_el_cliente_enviar_mas_informacion: masInfo,
      Tema_del_Proyecto: tema,
      Cantidad_de_Adjuntos: cantidad,
      Fecha_Final_de_Entrega: fechaFinal,
      Comentario_cerrado_nuevas_pautas: comentario,
    });
  }, [
    fechasEspecificas,
    tieneFechas,
    cuales,
    masInfo,
    tema,
    cantidad,
    workdrive,
    fechaFinal,
    comentario,
  ]);

  // function execute(func_name, req_data) {
  //   return new Promise(function (resolve, reject) {
  //     window.ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
  //       .then(function (data) {
  //         console.log(data);
  //       })
  //       .catch(function (error) {
  //         reject(error);
  //       });
  //   });
  // }

  const handleInfo = (e) => {
    e.preventDefault();
    let req_data = {
      arguments: JSON.stringify({
        data_map: formData,
        coord_id: coordId,
      }),
    };
    console.log(req_data);

    window.ZOHO.CRM.FUNCTIONS.execute("ActivarVentaAnticipadaWidget", req_data)
      .then(function (data) {
        window.ZOHO.CRM.UI.Popup.closeReload();
        console.log("DATA DEL GUARDAR", data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleInfo2 = (e) => {
    e.preventDefault();
    let req_data = {
      arguments: JSON.stringify({
        data_map: formData,
        coord_id: coordId,
      }),
    };
    console.log(req_data);

    window.ZOHO.CRM.FUNCTIONS.execute("ActivarVentaAnticipadaWidget", req_data)
      .then(function (data) {
        console.log("DATA DEL GUardar y avanzar", data);
        window.ZOHO.CRM.BLUEPRINT.proceed();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    window.ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };

  const handleClick = () => {
    window.open(workdrive, "_blank");
  };

  return (
    <div className="App">
      <div className="w-[100%] h-[50px] bg-blue-500 text-white font-bold text-lg flex justify-between items-center px-6 ">
        <p> Activar venta anticipada</p>
        <div className="cursor-pointer">
          <button className="custom-button" onClick={handleInfo2}>
            Guardar y avanzar
          </button>
          <button className="custom-button" onClick={handleInfo}>
            Solo guardar
          </button>
          <button className="custom-button" onClick={handleCancelar}>
            No guardar
          </button>
        </div>
      </div>
      <div className="formulario-activacion px-6 w-[100%] flex flex-col">
        <div className="flex gap-8">
          <div className="w-[50%]">
            <div className="slot">
              <label htmlFor="referenciaCliente">
                Tiene fechas especificas:
              </label>
              <select
                id="fechasEspecificas"
                value={tieneFechas}
                onChange={(e) => setTieneFechas(e.target.value)}
                required
              >
                {fechas.map((tipo, index) => (
                  <option key={index} value={tipo.display_value}>
                    {tipo.display_value}
                  </option>
                ))}
              </select>
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">
                Cuales son las fechas especificas:
              </label>
              <input
                type="text"
                id="referenciaCliente"
                value={cuales}
                onChange={(e) => setCuales(e.target.value)}
                required={fechasEspecificas === "si"}
                maxLength={200}
              />
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">
                Fecha especifica mas proxima:
              </label>
              <input
                type="date"
                id="referenciaCliente"
                value={fechasEspecificas}
                onChange={(e) => setFechasEspecificas(e.target.value)}
                required
              />
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">
                Debe el cliente enviar mas informacion?:
              </label>
              <select
                id="informacionAportada"
                value={masInfo}
                onChange={(e) => {
                  const value =
                    e.target.value === "-None-" ? "" : e.target.value;
                  setMasInfo(value);
                }}
                required
              >
                {aportado.map((tipo, index) => (
                  <option key={index} value={tipo.display_value}>
                    {tipo.display_value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="slot">
              <label htmlFor="referenciaCliente">Tema del proyecto:</label>
              <input
                type="text"
                id="referenciaCliente"
                value={tema}
                maxLength={1900}
                onChange={(e) => setTema(e.target.value)}
                required
              />
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">Cantidad de adjuntos:</label>
              <input
                type="number"
                onWheel={(e) => e.target.blur()}
                id="referenciaCliente"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">Fecha final de entrega:</label>
              <input
                type="date"
                id="referenciaCliente"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
                required
              />
            </div>

            <div className="slot">
              <label htmlFor="referenciaCliente">Comentario CNP:</label>
              <input
                type="text"
                id="referenciaCliente"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={1900}
                required
              />
            </div>
          </div>
        </div>
        <div className="slot">
          <label htmlFor="referenciaCliente">
            Modificar archivos para coordinacion:
          </label>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 w-[150px] text-center text-white font-bold rounded-md cursor-pointer"
          >
            Abrir carpeta
          </button>
        </div>
        <div className="w-[100%] flex justify-end mt-[40px]">
          {/* <div
            onClick={handleInfo}
            className="px-4 py-2 bg-blue-500 w-[120px] text-center text-white font-bold rounded-md cursor-pointer"
          >
            Activar
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
