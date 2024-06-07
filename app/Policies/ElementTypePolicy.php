<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\ElementTypes;
use App\Models\User;

class ElementTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
        return $user->role_id != null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ElementTypes $elementTypes): bool
    {
        //
        return $user->role_id != null;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
        return $user->role_id == 1;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ElementTypes $elementTypes): bool
    {
        //
        return $user->role_id == 1;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ElementTypes $elementTypes): bool
    {
        //
        return $user->role_id == 1;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ElementTypes $elementTypes): bool
    {
        //
        return $user->role_id == 1;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ElementTypes $elementTypes): bool
    {
        //
        return $user->role_id == 1;
    }
}
