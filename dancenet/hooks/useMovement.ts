import { useEffect, useState } from "react"

const useMovement = (database,id) => {
    const [movement, setMovement] = useState(null)
    const [loading, setLoading] = useState(true)
    const [people, setPeople] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await database.getAllAsync("SELECT * FROM movements WHERE id = ?;",[id])
                if(result.length > 0){
                    setMovement(result[0])
                    const peopleResult = await database.getAllAsync(
                        `SELECT people.* 
                        FROM people
                        JOIN person_movement ON people.id = person_movement.person_id
                        WHERE person_movement.movement_id = ?;
                        `, [id]
                    )
                    setPeople(peopleResult)
                }
            } catch (error) {
                console.error("Error consiguiendo datos de este movimiento: ",error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    },[id,database,people,movement])
    return {movement,loading,people}
}

export default useMovement