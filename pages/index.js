import styled from 'styled-components'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu } from '../src/lib/AlurakutCommons'

function ProfileSidebar(propriedades) {
	return (
    <Box> 
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}></img>
    </Box>
	)
}

export default function Home() {

  const githubUser = "dannilopires";

  const pessoas = ["juunegreiros", "omaurosouto", "peas", "badtuxx"]

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser}/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box> 
            Bem-Vindo
          </Box>
        </div>
      
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <Box> 
            Comunidades
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
