import { useState, useEffect } from 'react'
import axios from 'axios'
import './AboutUs.css'
import loadingIcon from './loading.gif'

/**
 * A React component that represents the About Us page of the app.
 * All of the page content is fetched as JSON from the back-end server.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const AboutUs = props => {
  const [about, setAbout] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  // fetch the page content from the back-end once, when the component first loads
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_HOSTNAME}/about`)
      .then(response => {
        // axios bundles up all response data in response.data property
        setAbout(response.data)
      })
      .catch(err => {
        const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
        setError(errMsg)
      })
      .finally(() => {
        // the response has been received, so remove the loading icon
        setLoaded(true)
      })
  }, []) // putting a blank array as second argument will cause this function to run only once when component first loads

  return (
    <>
      <h1>About Us</h1>

      {error && <p className="AboutUs-error">{error}</p>}
      {!loaded && <img src={loadingIcon} alt="loading" />}
      {about && (
        <article className="AboutUs-article">
          <img
            className="AboutUs-photo"
            src={about.imageUrl}
            alt={`A photo of ${about.name}`}
          />
          <h2>{about.name}</h2>
          {about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      )}
    </>
  )
}

// make this component available to be imported into any other file
export default AboutUs
