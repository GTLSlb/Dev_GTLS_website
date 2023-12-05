<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\PasswordResetNotification;
use App\Models\User;

class Employee extends User
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'password',
        'remember_token',
        'password',
        'UserId',
        'UniqueId',
        'TypeId',
        'TypeName',
        'OwnerId',
        'GroupId',
        'GroupName',
        'Username',
        'FirstName',
        'LastName',
        'Email',
        'PhoneNo',
        'Dob',
        'Address',
        'Picture',
        'NationalityId',
        'NationalityName',
        'BranchId',
        'RoleId',
        'RoleName',
        'ReportToId',
        'ReportToName',
        'HiringDate',
        'Applications',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'password',
        'UserId',
        'UniqueId',
        'TypeId',
        'TypeName',
        'OwnerId',
        'GroupId',
        'GroupName',
        'Username',
        'FirstName',
        'LastName',
        'Email',
        'PhoneNo',
        'Dob',
        'Address',
        'Picture',
        'NationalityId',
        'NationalityName',
        'BranchId',
        'RoleId',
        'RoleName',
        'ReportToId',
        'ReportToName',
        'HiringDate',
    ];
    public function parent()
    {
        return $this->belongsTo(User::class)->whereNull('parent_id');
    }
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role(){
        return $this->belongsTo(Role::class);
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordResetNotification($token));
    }
}
