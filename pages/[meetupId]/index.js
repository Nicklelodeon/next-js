import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// have to use if dynamic page and getStaticProps is used
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://nicholascheong2618:Inaymmm2618@cluster0.jyw8gxz.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  // first param is item to find, second param is which field to extract in each doc
  // in this case, only retrieve _id
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    // if false, any meetupId not stated will show 404 error
    // if true, any meetupId not stated will be rendered dynamically
    // if blocking, only renders page when it is fully created
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // identifier in square bracket [meetupId] will be properties and the
  // values (meetupId) are actual values encoded in url
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://nicholascheong2618:Inaymmm2618@cluster0.jyw8gxz.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  // first param is item to find, second param is which field to extract in each doc
  // in this case, only retrieve _id
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();
  // fetch data for single meetup
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
