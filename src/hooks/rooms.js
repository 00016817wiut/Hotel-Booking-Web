import { useEffect } from "react";

export const useRooms = (setRoomsLoading, setAllRooms, fetchActiveRooms, toast) => {

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setRoomsLoading(true);
      try {
        const rows = await fetchActiveRooms();
        if (!alive) return;
        setAllRooms(rows);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load rooms.");
        setAllRooms([]);
      } finally {
        if (alive) setRoomsLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [])
}

export const useAvailableRooms = (hasDateFilter, setAvailabilityLoading, setAvailableRooms, fetchAvailableRooms, toast, hasGuestFilter, guests, checkIn, checkOut) => {
  useEffect(() => {
    let alive = true;

    const loadAvailability = async () => {
      if (!hasDateFilter) {
        setAvailableRooms(null);
        return;
      }

      setAvailabilityLoading(true);
      try {
        const g = hasGuestFilter ? guests : 1;
        const rows = await fetchAvailableRooms({
          checkIn,
          checkOut,
          guests: g,
          type: null,
        });
        if (!alive) return;
        setAvailableRooms(rows);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load availability.");
        setAvailableRooms([]);
      } finally {
        if (alive) setAvailabilityLoading(false);
      }
    };

    loadAvailability();
    return () => {
      alive = false;
    };
  }, [checkIn, checkOut, guests, hasDateFilter, hasGuestFilter]);
}


// details


export const useRoomDetails = (id, setLoading, setRoom, fetchRoomById, toast) => {
  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const r = await fetchRoomById(id);
        if (!alive) return;
        setRoom(r);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load room.");
        setRoom(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [id])
}