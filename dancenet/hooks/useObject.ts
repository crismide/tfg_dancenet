import { useEffect, useState } from "react"

const useObjectInfo = (database,id) => {
    const [object, setObject] = useState(null)
    const [movements, setMovements] = useState(null)
    const [people, setPeople] = useState(null)
    const [peopleRes, setPeopleRes] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await database.getAllAsync("SELECT * FROM objects WHERE id = ?;",[id])
                if(result.length > 0){
                    setObject(result[0])
                    const [movementsResult, peopleResult, peopleResResult] = await Promise.all([database.getAllAsync(     `SELECT m.* 
                        FROM movements m
                        INNER JOIN movement_object mo ON m.id = mo.movement_id
                        WHERE mo.object_id = ?;`,
                       [id]
                     ),
                    database.getAllAsync(
                        `SELECT p.* 
                        FROM people p
                        INNER JOIN people_object_user pou ON p.id = pou.person_id
                        WHERE pou.object_id = ?;`,
                       [id]),
                    database.getAllAsync(
                       
                        `SELECT p.* 
                        FROM people p
                        INNER JOIN people_object_responsible por ON p.id = por.person_id
                        WHERE por.object_id = ?;`,
                    [id])])
                    setMovements(movementsResult)
                    setPeople(peopleResult)
                    setPeopleRes(peopleResResult)
                }
            } catch (error) {
                console.error("Ha habido algún error recogiendo la información del objecto: ",error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    },[id,database,object,movements,people,peopleRes])
    
    return {object,movements,people,peopleRes,loading}
}

export default useObjectInfo