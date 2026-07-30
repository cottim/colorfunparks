<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pending_email_changes', function (Blueprint $table) {
            $table->dropUnique('pending_email_changes_email_unique');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::table('pending_email_changes', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->unique('email');
        });
    }
};
