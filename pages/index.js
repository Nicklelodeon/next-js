import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";


function HomePage(props) {
  
  return <Fragment>
  <Head>
    <title>React Meetups</title>
    <meta name="description" content="Browse a huge list of highly active React meetups!"/>
  </Head>
  <MeetupList meetups={props.meetups} />;
  </Fragment>
}

// reserved name, executes function during pre-rendering process (calls this
// before component function = HomePage())
export async function getStaticProps() {
  // fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://nicholascheong2618:Inaymmm2618@cluster0.jyw8gxz.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  // find all documents in the collection
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address, 
        image: meetup.image, 
        id: meetup._id.toString()
      })),
    },
    // generated every 10 secs if there are requests
    revalidate: 10,
  };
}

// // always run for every request after deployment
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data from API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

export default HomePage;
