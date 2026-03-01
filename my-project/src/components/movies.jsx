import React from "react";
import { auth, db , storage } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
export default function Movies() {
    const [movies, setMovies] = React.useState([]);
    const movieCollectionRef = collection(db, "movies");

    const getmovieList = async () => {
        try {
            const data = await getDocs(movieCollectionRef);
            setMovies(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (err) {
            console.log(err);
        }
    }

    const deleteMovie = async (id) => {
        try {
            await deleteDoc(doc(db, "movies", id));
            getmovieList();
        } catch (err) {
            console.log(err);
        }
    }

    const updateMovie = async (id, updatedData) => {
        try {
            const movieDoc = doc(db, "movies", id);
            await updateDoc(movieDoc, updatedData);
            getmovieList(); // This refreshes the list
        } catch (err) {
            console.log(err);
        }
    }

    const Movie = (props) => {
        const [movieUpdatestate, setMovieUpdateState] = React.useState(false);
        return (
            <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl transition-all hover:scale-[1.02] hover:border-emerald-500/50 m-5">
                {movieUpdatestate ? (
                    /* I added 'id' and 'setMovieUpdateState' here so the input knows what to update */
                    <MovieInput title="Update Movie data" buttonText="Update Movie" id={props.id} setMovieUpdateState={setMovieUpdateState} />
                ) : (
                    <>
                        <div className="flex items-start justify-between">
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                {props.title}
                            </h1>

                            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${props.recieved_an_oscar
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                                }`}>
                                {props.recieved_an_oscar ? "🏆 Oscar Winner" : "No Oscar"}
                            </span>
                        </div>

                        <hr className="border-zinc-800" />

                        <div className="flex items-center gap-2 text-zinc-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium uppercase tracking-widest">
                                Released: <span className="text-zinc-100">{String(props.release_date)}</span>
                                <button
                                    onClick={() => deleteMovie(props.id)}
                                    className="group/delete absolute bottom-4 right-4 p-2 rounded-lg transition-all hover:bg-red-500/10 active:scale-90"
                                    title="Delete Movie"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-zinc-500 transition-colors group-hover/delete:text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setMovieUpdateState(!movieUpdatestate)}
                                    className="group/delete absolute bottom-4 right-4 p-2 rounded-lg transition-all hover:bg-red-500/10 active:scale-90 mx-10"
                                    title="Edit Movie"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-zinc-500 transition-colors group-hover/edit:text-indigo-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        )
    }

    const MovieInput = (props) => {
        const [title, setTitle] = React.useState("");
        const [releaseDate, setReleaseDate] = React.useState("");
        const [receivedOscar, setReceivedOscar] = React.useState(false);
        const [fileUpload, setFileUpload] = React.useState(null);
        const onSubmitMovie = async () => {
            try {
                await addDoc(collection(db, "movies"), {
                    title: title,
                    release_date: releaseDate,
                    recieved_an_oscar: receivedOscar,
                    user_id: auth.currentUser.uid
                });
                getmovieList();
            }
            catch (err) {
                console.log(err);
            }
        }
        const UploadFile = async()=>{
            try{
                if(!fileUpload){
                    return;
                }
                else{
                    const storageRef = ref(storage,`projectFiles/${fileUpload.name}`);
                    await uploadBytes(storageRef, fileUpload);
                }
            }
            catch(err){
                console.log(err);
            }
        }

        return (
            <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">{props.title}</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Database Entry</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="group flex flex-col gap-1">
                        <input
                            type="text"
                            placeholder="Movie Title"
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="group flex flex-col gap-1">
                        <input
                            type="number"
                            placeholder="Release Year"
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                            onChange={(e) => setReleaseDate(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <input type="file" name="" id="movie-image-input" onChange={(e)=>setFileUpload(e.target.files[0])}/>
                        <button onClick={UploadFile}>Upload</button>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/30 p-3 transition-colors hover:bg-zinc-800/50">
                        <input
                            id="oscar-checkbox"
                            type="checkbox"
                            className="size-5 cursor-pointer appearance-none rounded-md border-2 border-zinc-700 bg-zinc-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all focus:ring-0 focus:ring-offset-0"
                            onChange={(e) => setReceivedOscar(e.target.checked)}
                        />
                        <span className="text-sm font-medium text-zinc-300 select-none">Received an Oscar?</span>
                    </label>

                    <button className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_RGBA(16,185,129,0.3)] active:scale-95"
                        onClick={props.buttonText === "Update Movie" ? async () => {
                            await updateMovie(props.id, { title, release_date: releaseDate, recieved_an_oscar: receivedOscar });
                            props.setMovieUpdateState(false); // This closes the edit UI
                        } : onSubmitMovie
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {props.buttonText || "Add Movie"}
                    </button>
                </div>
            </div>
        )
    }

    React.useEffect(() => {
        getmovieList();
    }, [])

    return (
        <>
            <div className="p-4 border-2 border-gray-300 rounded-lg w-1/3 mx-auto mt-10">
                {movies.map((movie, key) => {
                    return <Movie key={key} {...movie} />
                })}
            </div>
            <MovieInput title="Add Movie" />
        </>
    )
}