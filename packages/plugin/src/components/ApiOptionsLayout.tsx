import { useCallback, useContext } from 'react'
import { ApiOptionsContext } from './ApiItem'

export default function ApiOptionsLayout() {
  const { hideInherited, setHideInherited } = useContext(ApiOptionsContext);
  const handleHideInherited = useCallback(() => {
    setHideInherited(!hideInherited);
  }, [hideInherited, setHideInherited]);

  return (
    <>
      <div>
        <input checked={hideInherited} type="checkbox" onChange={handleHideInherited} />
      </div>
    </>
  );
}
