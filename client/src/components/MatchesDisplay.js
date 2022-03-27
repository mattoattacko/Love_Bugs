import axios from "axios"
import { useState, useEffect } from "react"
import { useCookies } from "react-cookie"


const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(["user"])

  //will return an array instead of an array of objects (our matched user IDs)
  const matchedUserIds = matches.map(({ user_id }) => user_id)
  const userId = cookies.UserId

  const getMatches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users', {
        params: {userIds: JSON.stringify(matchedUserIds)}
      })
      setMatchedProfiles(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMatches()
  }, [matches])

  // filters out users only if they have matched with us.
  // goes into matched profiles, and then goes into each profiles matches and filters out the the ones that have our user id.
  const filteredMatchesProfiles = matchedProfiles?.filter(
    (matchedProfile) => 
      matchedProfile.matches.filter((profile) => profile.user_id === userId).length > 0
  )

  return (
    <div className='matches-display' >
      {filteredMatchesProfiles?.map((match) => (
        <div key={match.user_id} className='match-card' onClick={() => setClickedUser(match)} >
          <div className='img-container' >
            <img src={match?.url} alt={match?.first_name + ' profile'} />
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}      
    </div>
  )
}

export default MatchesDisplay