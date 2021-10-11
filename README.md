# React Suspense Data
### Support
✅ Typescript support

### Example
```
import { Suspendable, useSuspendableData } from 'react-suspense-data'

const UserPage = ({ userId }) => {
  const suspendableData = useSuspendableData(() => getUserAsync({ id: userId }), [userId])

  return (
    <React.Suspense fallback={<Loading />}>
       <Suspendable data={suspendableData}>
         {data => <UserProfile user={data}/>}
       </Suspendable>
    </React.Suspense>
  )
}
```
