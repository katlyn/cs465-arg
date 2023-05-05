import type {V2_MetaFunction} from "@remix-run/react";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {ActionArgs, json, LoaderArgs, redirect} from "@remix-run/node";
import {commitSession, getSession} from "~/sessions";
import {getFirst, getUser} from '~/keys.server'
import prisma from "~/prisma.server";

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
  return [{title: "Hi there!"}];
};

export const action = async ({request}: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"))
  const formData = await request.formData()
  const key = Number(formData.get("key"))

  const user = getUser(key)

  if (user === undefined) {
    return json(true)
  }
  session.set("user", user)
  return redirect("/second", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  })
}

export const loader = async ({request}: LoaderArgs) => {
  const leaderboard = await prisma.leaderboardEntry.findMany({
    orderBy: {
      date: "asc"
    },
    select: {
      date: true,
      name: true
    }
  })

  return json(leaderboard)
}

export default function Index() {
  const didError = useActionData<typeof action>()
  const leaderboard = useLoaderData<typeof loader>()
  return (
    <div style={{fontFamily: "serif", lineHeight: "1.4"}}>
      <Form method="post">
        <label>{didError ? (<span style={{color: "red"}}>That is not your key.</span>) : "Enter your key:"} </label>
        <input name="key" type="text"/>
        <button type="submit">Submit</button>
      </Form>
      <h2>Leaderboard</h2>
      { leaderboard.length > 0 ? (<ol>
        {leaderboard.map(entry => (<li>{entry.name}, {new Date(entry.date).toLocaleTimeString()}</li>))}
      </ol>) : <em>No one has solved all challenges yet.</em>}
    </div>
  );
}
