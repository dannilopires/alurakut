import {SiteClient} from 'datocms-client'

export default async function recebedorDeRequests(request, response) {

    if (request.method == 'POST'){
        const TOKEN = `bd1617f1a5172439009f47e33ac4fa`;

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "980521",
            ...request.body,
            //title: "Comunidade de teste",
            //imageUrl: "",
            //creatorSlug: ""


        })

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem'
    })
}

