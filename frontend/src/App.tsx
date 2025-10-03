import { Route, Routes } from "react-router";
import { Layout,Profile,Homepage,ProtectedPage,Auth,NewWords,FlashCard, Word, Quiz, NotFound } from "./Pages/Index";

export default function App() {
  return (

    <Routes>
      <Route>
        <Route element={<Layout/>}>
          <Route index element={<ProtectedPage><Homepage/></ProtectedPage>}/>
          <Route path="auth" element={<Auth/>}/>
          <Route path="profile" element={<ProtectedPage><Profile/></ProtectedPage>}/>

          <Route path="flashcard">
            <Route index element={<ProtectedPage><FlashCard /></ProtectedPage>} />
            <Route path="newwords" element={<ProtectedPage><NewWords /></ProtectedPage>} />
            <Route path="quiz" element={<ProtectedPage><Quiz /></ProtectedPage>} />
            <Route path="word" element={<ProtectedPage><Word /></ProtectedPage>} />
          </Route>

          <Route path="*" element={<NotFound/>} />

        </Route>
      </Route>
    </Routes>
  )
}

