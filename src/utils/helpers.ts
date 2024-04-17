import { Repack } from "src/entity";
import { months } from "../constants";

export const formatUploadDate = (str: string) => {
    const date = new Date();

    const [month, day, year] = str.split(" ");

    date.setMonth(months.indexOf(month.replace(".", "")));
    date.setDate(Number(day.substring(0, 2)));
    date.setFullYear(Number("20" + year.replace("'", "")));
    date.setHours(0, 0, 0, 0);

    return date;
};

export const groupRepackers = (repackers: Repack[]) => {
    const agrupado: { [categoria: string]: string[] } = {};

    repackers.forEach(repack => {
        // Verificar se a categoria já existe no objeto agrupado
        if (!agrupado[repack.repacker]) {
            // Se não existe, inicializar um array vazio para essa categoria
            agrupado[repack.repacker] = [];
        }
        // Adicionar o objeto à lista de objetos para essa categoria
        agrupado[repack.repacker].push(repack.title);
    });

    return agrupado;
} 
