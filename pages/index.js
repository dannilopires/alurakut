import styled from 'styled-components'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
	return (
    <Box as="aside"> 
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}></img>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>

      <AlurakutProfileSidebarMenuDefault/>

    </Box>
	)
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper> 
            <h2 className="smallTitle">
              {propriedades.title}({propriedades.items.length})
            </h2>

            {<ul>
              {propriedades.items.slice(0,6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.login}`} >
                      <img src={itemAtual.avatar_url}/>
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                  )
              })}
            </ul>}
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]); 
//const comunidades = comunidades[0];
//const alteradorDeComunidades/setComunidades = comunidades[1];
//React.useState... ===> hooks 
//define duas constantes: comunidades (retorna o primeiro elemento do array - readOnly), setComunidades(o elemento a ser add)

  const githubUser = props.githubUser;

  const pessoas = [
    "juunegreiros", 
    "omariosouto", 
    "peas", 
    "badtuxx", 
    "anuraghazra", 
    "peixebabel"
  ];

  const [seguidores, setSeguidores] = React.useState([]);

 //0 - Pegar o array de dados do github
  React.useEffect(function() {
    fetch('https://api.github.com/users/dannilopires/followers')
    .then(function(respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })



    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '4dfc070989f86781b15991d9f85944',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }, 
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`}) 

      })
      .then((response) => response.json()) //Pega o retorno do response.json() e j?? retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato)
        setComunidades(comunidadesVindasDoDato)
      })

  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser}/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box> 
            <h1 className="title">
              Bem-Vindo(a)
            </h1>
            <OrkutNostalgicIconSet/>
          </Box>

          <Box>
            <h2 className="subTitle">
              O que voc?? deseja fazer?
            </h2>
            <form onSubmit={function handleCriaComunidade(e){
	              e.preventDefault();

                const dadosDoForm = new FormData(e.target); 
                //console.log("Campo: ", dadosDoForm.get('title'));
                //console.log("Campo: ", dadosDoForm.get('image'));

                const comunidade ={ 
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: githubUser,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                })
	            
              }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
      
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={seguidores}/>


          <ProfileRelationsBoxWrapper> 
            <h2 className="smallTitle">
              Pessoas da comunidade({pessoas.length})
            </h2>

            <ul>
              {pessoas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                  )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper> 
            <h2 className="smallTitle">
              Comunidades({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                  )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
 // const decodedToken = jwt.decode(token);
 // const githubUser = decodedToken?.githubUser;

  if (token === undefined) {
    return {
      redirect: {
        destination: 'login',
        permanent: false,
      }
    }
  }
  
  const { isAuthenticated } = await fetch("https://alurakut.vercel.app/api/auth", {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())
  
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  
  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    },
  }
  
    
}